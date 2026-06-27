
import { Link, useNavigate } from 'react-router-dom'
import logoIcon from '../../assets/cubit-logo-icon-svg.svg'
import illustration from '../../assets/login-signup-illustration.png'
import './auth.css'

export default function Signup() {
  const navigate = useNavigate()

  const handleSignupSubmit = (e) => {
    e.preventDefault()
    navigate('/profile')
  }
  return (
    <div className="auth-page">

      {/* ── Left: Illustration panel ── */}
      <div className="auth-illustration-panel">
        <img
          src={illustration}
          alt="Cuber with Rubik's cube"
          className="auth-illustration-img"
        />
        <div className="auth-illustration-text">
          <h2 className="auth-illustration-heading">Start your Cubing Journey</h2>
          <p className="auth-illustration-sub">Sign Up for free and Get Started !</p>
        </div>
      </div>

      {/* ── Right: Form panel ── */}
      <div className="auth-form-panel">

        {/* Logo */}
        <div className="auth-logo-block">
          <img src={logoIcon} alt="Cubit Logo" className="auth-logo-icon" />
          <span className="auth-logo-wordmark">
            <span className="auth-logo-c">C</span> U B I T
          </span>
        </div>

        <form className="auth-form-card" onSubmit={handleSignupSubmit}>
          <h1 className="auth-page-title">Create a new Account</h1>

          {/* Google OAuth button */}
          <button type="button" className="auth-google-btn" id="signup-google-btn">
            <svg className="auth-google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="auth-divider">or Sign Up with Email</div>

          {/* Fields */}
          <div className="auth-fields">
            <div className="auth-field-group">
              <label htmlFor="signup-username" className="auth-label">Username</label>
              <input
                id="signup-username"
                type="text"
                className="auth-input"
                placeholder="Bruhaa"
                autoComplete="username"
              />
            </div>

            <div className="auth-field-group">
              <label htmlFor="signup-email" className="auth-label">Email</label>
              <input
                id="signup-email"
                type="email"
                className="auth-input"
                placeholder="mail@abc.com"
                autoComplete="email"
              />
            </div>

            <div className="auth-field-group">
              <label htmlFor="signup-password" className="auth-label">Password</label>
              <input
                id="signup-password"
                type="password"
                className="auth-input"
                placeholder="••••••••••••••••"
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="auth-submit-btn" id="signup-submit-btn">
            Sign Up
          </button>

          {/* Redirect to login */}
          <p className="auth-redirect">
            Already have an Account ?
            <Link to="/login" id="signup-to-login-link">Login</Link>
          </p>
        </form>
      </div>

    </div>
  )
}
