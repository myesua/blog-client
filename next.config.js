/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: { ignoreDuringBuilds: true },
  NEXT_PUBLIC_DISABLE_ERROR_OVERLAY: true,
  env: {
    API_URL: process.env.API_URL,
    POSTS_URL: process.env.POSTS_URL,
    TIPS_URL: process.env.TIPS_URL,
    CATEGORIES_URL: process.env.CATEGORIES_URL,
    USER_DASHBOARD_URL: process.env.USER_DASHBOARD_URL,
    UPLOAD_IMAGE_URL: process.env.UPLOAD_IMAGE_URL,
    UPDATE_PROFILE_URL: process.env.UPDATE_PROFILE_URL,
    UPDATE_URL: process.env.UPDATE_URL,
    RECOVERY_URL: process.env.RECOVERY_URL,
    RESET_URL: process.env.RESET_URL,
    RESEND_URL: process.env.RESEND_URL,
    CONFIRM_URL: process.env.CONFIRM_URL,
    VERIFY_URL: process.env.VERIFY_URL,
    REFRESH_URL: process.env.REFRESH_URL,
    LOGIN_URL: process.env.LOGIN_URL,
    LOGINAUTH_URL: process.env.LOGINAUTH_URL,
    SIGNUP_URL: process.env.SIGNUP_URL,
    LOGOUT_URL: process.env.LOGOUT_URL,
    ADMIN_URL: process.env.ADMIN_URL,
    PENDING_URL: process.env.PENDING_URL,
    REJECTED_URL: process.env.REJECTED_URL,
    TASKS_URL: process.env.TASKS_URL,
    ADMIN: process.env.ADMIN,
    SUBSCRIPTIONS_URL: process.env.SUBSCRIPTIONS_URL,
    UNSUBSCRIBE_URL: process.env.UNSUBSCRIBE_URL,
  },
  images: {
    domains: ['res.cloudinary.com', 'cdn.pixabay.com'],
  },
  experimental: {
    largePageDataBytes: 128 * 100000,
  },
  poweredByHeader: false,
};

module.exports = nextConfig;
