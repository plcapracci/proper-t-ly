import { redirect } from 'next/navigation';

export default function Home() {
  // This is a placeholder - in a real app, we would check authentication status
  // and redirect accordingly
  // For now, we'll just redirect to the login page
  redirect('/auth/login');
  
  // This won't be rendered due to the redirect above
  return null;
} 