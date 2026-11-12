import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/useAuth';

const Footer = () => {
  const { openDemoModal, openAuthModal, openGithubModal } = useAuth();
  return (
    <footer className="bg-[#111827] px-6 py-14 text-white">
      <div className="mx-auto max-w-[1120px]">

        {/* Main Footer */}
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">

              <span className="text-xl font-extrabold tracking-[-0.04em]">
                CampusCode
              </span>

              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-[9px] font-bold text-[#111827]">
                AI
              </span>

            </div>

            <p className="mt-4 max-w-[360px] text-sm leading-6 text-[#9CA3AF]">
              Turn real codebases into verified, explainable
              engineering profiles for students and recruiters.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white">
              Product
            </h3>

            <div className="mt-4 space-y-3 text-sm text-[#9CA3AF]">

              <a
                href="#features"
                className="block transition hover:text-white"
              >
                Features
              </a>

              <button
                type="button"
                onClick={openDemoModal}
                className="block text-left transition hover:text-white cursor-pointer"
              >
                Live Interactive Demo
              </button>

              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="block text-left transition hover:text-white cursor-pointer"
              >
                Create Account
              </button>

              <button
                type="button"
                onClick={openGithubModal}
                className="block text-left transition hover:text-white cursor-pointer"
              >
                Sign in with GitHub
              </button>

            </div>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white">
              Connect
            </h3>

            <div className="mt-4 flex gap-3">

              {/* GitHub */}
              <a
                href="#"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#374151] text-[#9CA3AF] transition hover:border-[#10B981] hover:text-white"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#374151] text-[#9CA3AF] transition hover:border-[#10B981] hover:text-white"
              >
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>

              {/* Email */}
              <a
                href="#"
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#374151] text-[#9CA3AF] transition hover:border-[#10B981] hover:text-white"
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </a>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-[#374151] pt-5 text-xs text-[#6B7280]">
          © 2026 CampusCode. Built for verifiable engineering.
        </div>

      </div>
    </footer>
  );
};

export default Footer;