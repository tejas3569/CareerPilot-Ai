from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.profile import Profile
from app.schemas.auth import UserRegister, UserLogin, Token, ForgotPasswordRequest
from app.schemas.user import UserOut
from app.utils.security import hash_password, verify_password, create_access_token
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    """Register a new student account."""
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    hashed_pw = hash_password(payload.password)
    new_user = User(
        email=payload.email.lower(),
        hashed_password=hashed_pw,
        is_demo=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create associated default profile
    new_profile = Profile(
        user_id=new_user.id,
        name=payload.name or "Student",
        target_role=payload.target_role or "Software Developer"
    )
    db.add(new_profile)
    db.commit()

    token = create_access_token({"user_id": new_user.id, "email": new_user.email})
    return Token(
        access_token=token,
        token_type="bearer",
        user_id=new_user.id,
        email=new_user.email,
        is_demo=False
    )

@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """Authenticate student with email and password."""
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = create_access_token({"user_id": user.id, "email": user.email})
    return Token(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        is_demo=user.is_demo
    )

@router.post("/demo-login", response_model=Token)
def demo_login(db: Session = Depends(get_db)):
    """One-click instant demo login with pre-populated student profile."""
    demo_email = "demo.student@careerpilot.ai"
    user = db.query(User).filter(User.email == demo_email).first()
    
    if not user:
        # Create persistent demo user
        user = User(
            email=demo_email,
            hashed_password=hash_password("DemoPassword123!"),
            is_demo=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Populate demo profile
        profile = Profile(
            user_id=user.id,
            name="Alex Chen",
            college="University of California, Berkeley",
            degree="B.S. in Computer Science",
            graduation_year="2026",
            target_role="AI/ML Engineer",
            bio="CS senior passionate about applied deep learning, distributed model training, and building scalable production ML APIs.",
            github="https://github.com/alexchen-demo",
            linkedin="https://linkedin.com/in/alexchen-demo",
            portfolio="https://alexchen.dev"
        )
        db.add(profile)
        db.commit()

    token = create_access_token({"user_id": user.id, "email": user.email, "is_demo": True})
    return Token(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        is_demo=True
    )

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest):
    """Password reset request endpoint."""
    return {
        "message": f"If an account with {payload.email} exists, password reset instructions have been dispatched.",
        "success": True
    }

@router.get("/me", response_model=UserOut)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Retrieve profile and account details of authenticated user."""
    return current_user
