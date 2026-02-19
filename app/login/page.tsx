import Sidebar from '@/components/Sidebar';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1">
        <div className="border-b border-gray-800 p-4 backdrop-blur bg-black/80 sticky top-0">
          <h2 className="text-xl font-bold">Login - OSINT Challenge</h2>
        </div>

        <LoginForm />
      </main>
    </div>
  );
}
