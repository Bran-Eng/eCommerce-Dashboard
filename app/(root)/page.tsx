import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';

const SetupPage = () => {
  return (
    <div className='p-4'>
      <UserButton afterSignOutUrl='/'></UserButton>
    </div>
  );
};

// Next.js creates a route for this page based on the file name due to the default export.
export default SetupPage;

// This creates a route at /about
