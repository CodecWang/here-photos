import { redirect } from 'next/navigation';
// import { useEffect } from 'react';

export default function App() {
  redirect('/photos');

  // const router = useRouter();

  // if not initialized, redirect to welcome page to setup the app

  // if not logged in, redirect to login page

  // if logged in, redirect to photos page

  // useEffect(() => {
  //   console.log('>>> Redirecting to /photos');

  //   router.replace('/photos');
  // }, []);

  // return null;

  // return (
  //   <div>
  //     <h1>Welcome to use Here</h1>
  //     <button
  //       className="btn rounded-none w-64"
  //       onClick={() => router.replace('/photos')}
  //     >
  //       Go to Main
  //     </button>
  //     <button className="btn">Button</button>
  //     <button className="btn btn-primary glass">Button</button>
  //     <button className="btn btn-secondary">Button</button>
  //     <input type="checkbox" className="checkbox checkbox-secondary" />
  //     <div className="glass bg-slate-400 h-32">Glass</div>
  //   </div>
  // );
}
