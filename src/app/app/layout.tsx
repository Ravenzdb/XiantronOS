import {redirect} from 'next/navigation';import type {ReactNode} from 'react';
// Protected application areas stay closed until a production auth provider is configured.
export default function ProtectedLayout({children}:{children:ReactNode}){void children;redirect('/login');}
