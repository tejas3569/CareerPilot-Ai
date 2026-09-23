import uuid
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.profile import Profile
from app.utils.security import decode_access_token, hash_password

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Dependency to retrieve authenticated user from Bearer JWT or Firebase token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception

    payload = decode_access_token(token)
    if not payload:
        raise credentials_exception

    user_id = payload.get("user_id") or payload.get("sub")
    email = payload.get("email")
    if user_id is None and email is None:
        raise credentials_exception

    user = None
    if user_id is not None and isinstance(user_id, int):
        user = db.query(User).filter(User.id == user_id).first()

    if not user and email:
        user = db.query(User).filter(User.email == email.lower()).first()

    # If the user is authenticated via Firebase / Google but not yet in SQLite DB, auto-provision
    if not user and email:
        try:
            user = User(
                email=email.lower(),
                hashed_password=hash_password(str(uuid.uuid4())),
                is_demo=False
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            user_name = payload.get("name") or email.split("@")[0].capitalize()
            profile = Profile(
                user_id=user.id,
                name=user_name,
                target_role="Software Developer"
            )
            db.add(profile)
            db.commit()
        except Exception as e:
            db.rollback()
            # If concurrent creation happened, try fetching again
            user = db.query(User).filter(User.email == email.lower()).first()
            if not user:
                raise credentials_exception

    if not user:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user account")

    return user
