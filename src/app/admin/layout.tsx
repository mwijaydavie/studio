"use client";

import React, { useEffect, useState } from 'react';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { doc } from 'firebase/firestore';
import { Loader2, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, firestore, isUserLoading } = useFirebase();
  const router = useRouter();
  
  const userRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user?.uid]);
  const { data: userData, isLoading: isRoleLoading } = useDoc(userRef);

  const isAdmin = userData?.role === 'admin';

  if (isUserLoading || isRoleLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-6 bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Verifying Credentials</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center p-8 text-center bg-background text-foreground">
        <div className="h-20 w-20 rounded-[2rem] bg-destructive/10 flex items-center justify-center mb-6">
          <ShieldAlert className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-headline font-bold mb-2">Access Restricted</h1>
        <p className="text-muted-foreground mb-8 max-w-xs mx-auto">This frequency is only accessible to system administrators.</p>
        <Button onClick={() => router.push('/dashboard')} className="rounded-2xl px-10 h-14 bg-white/5 border border-white/10 hover:bg-white/10 font-bold uppercase tracking-widest text-[10px]">
          <ArrowLeft className="mr-2 h-4 w-4" /> Exit Node
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
