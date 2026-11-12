import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/useAuth';

const Footer = () => {
  const { openDemoModal, openAuthModal, openGithubModal, isAuthenticated } = useAuth();

  return (
    <footer className="border-t border-[var(--color-rule)] bg-[color:var(--color-source)] px-6 py-14 text-[color:var(--color-ink)]">
      <div className="cc-container">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/assets/logo.png" alt="" width={22} height={22} className="h-5 w-5 invert" />
              <span className="cc-title text-base">CampusCode</span>
              <span className="rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-surface)] px-1.5 py-0.5 text-[9px] font-medium text-[color:var(--color-instrument)]">
                AI
              </span>
            </div>

            <p className="cc-copy mt-4 max-w-[360px] text-xs">
              Turn real codebases into verified, explainable engineering profiles for students and
              recruiters.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="cc-label uppercase tracking-[0.15em]">Product</h3>

            <div className="mt-4 space-y-2.5 text-xs">
              <a href="/#features" className="cc-link block no-underline">
                Features
              </a>

              <button
                type="button"
                onClick={openDemoModal}
                className="cc-link block text-left cursor-pointer"
              >
                Live Interactive Demo
              </button>

              {isAuthenticated ? (
                <Link to="/dashboard" className="cc-link block no-underline">
                  Engineering Dashboard
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => openAuthModal('signup')}
                    className="cc-link block text-left cursor-pointer"
                  >
                    Create Account
                  </button>

                  <button
                    type="button"
                    onClick={openGithubModal}
                    className="cc-link block text-left cursor-pointer"
                  >
                    Sign in with GitHub
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h3 className="cc-label uppercase tracking-[0.15em]">Connect</h3>

            <div className="mt-4 flex gap-2.5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="cc-button cc-button--quiet min-h-9 w-9 px-0"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="cc-button cc-button--quiet min-h-9 w-9 px-0"
              >
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>

              <a
                href="mailto:hello@campuscode.ai"
                aria-label="Email"
                className="cc-button cc-button--quiet min-h-9 w-9 px-0"
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--color-rule)] pt-5 text-xs text-[color:var(--color-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 CampusCode. Built for verifiable engineering.</span>
          <span>Console Graphite Evidence System</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
