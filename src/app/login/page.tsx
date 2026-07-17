
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { 
  signInAnonymously, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Music2, ArrowRight, Sparkles, Loader2, User, ShieldCheck, Mail, Lock, Zap, Globe, Cpu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMusic } from '@/context/music-context';

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"anonymous" | "email">("anonymous");
  
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { playUISound } = useMusic();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    playUISound('resonance');
    try {
      const provider = new GoogleAuthProvider();
      // Optimization: Force select_account for mobile hardware reliability
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(firestore, 'users', user.uid), {
        id: user.uid,
        username: user.displayName || "Aura Architect",
        photoURL: user.photoURL || `https://picsum.photos/seed/${user.uid}/200/200`,
        email: user.email,
        role: 'user',
        updatedAt: serverTimestamp(),
      }, { merge: true });

      toast({ title: "Google Node Synchronized", description: `Architect ${user.displayName} connected.` });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Google Auth Error:", error.code);
      let msg = "The neural link was interrupted.";
      if (error.code === 'auth/popup-closed-by-user') msg = "Handshake aborted by architect.";
      if (error.code === 'auth/network-request-failed') msg = "High-frequency network interference.";
      
      toast({ variant: "destructive", title: "Identity Error", description: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleFinalInitialize = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (mode === "anonymous" && !name.trim()) {
      toast({ variant: "destructive", title: "Identity Required", description: "Enter your Architect designation." });
      return;
    }
    if (mode === "email" && (!email.trim() || !password.trim())) {
      toast({ variant: "destructive", title: "Credentials Required", description: "Email and Access Key required." });
      return;
    }

    setLoading(true);
    playUISound('click');
    try {
      let user;
      if (mode === "anonymous") {
        const userCred = await signInAnonymously(auth);
        user = userCred.user;
      } else {
        try {
          const userCred = await signInWithEmailAndPassword(auth, email, password);
          user = userCred.user;
        } catch (signInErr: any) {
          if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            user = userCred.user;
          } else {
            throw signInErr;
          }
        }
      }

      const finalName = name.trim() || email.split('@')[0] || "Aura Architect";
      const placeholderURL = `https://picsum.photos/seed/${user.uid}/200/200`;
      
      await updateProfile(user, { 
        displayName: finalName,
        photoURL: placeholderURL
      });
      
      await setDoc(doc(firestore, 'users', user.uid), {
        id: user.uid,
        username: finalName,
        photoURL: placeholderURL,
        email: mode === 'email' ? email : `${user.uid}@auratune.active`,
        role: 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      toast({
        title: `Aura Established`,
        description: `Welcome Architect ${finalName}.`,
      });

      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Link Error",
        description: error.message || "Could not stabilize identity node.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
      <div className="aura-bg">
        <div className="aura-blob bg-primary/20 top-[-10%] left-[-10%] w-[60vw] h-[60vw]" />
        <div className="aura-blob bg-accent/15 bottom-[-10%] right-[-10%] w-[50vw] h-[50vw]" />
      </div>

      <div className="w-full max-w-lg flex flex-col items-center gap-10 relative z-10">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 rounded-3xl liquid-glass mx-auto flex items-center justify-center animate-float shadow-3xl border-border">
            <Music2 className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold tracking-tighter text-foreground">AuraTune Pro</h1>
            <p className="text-[8px] uppercase tracking-[0.4em] font-black opacity-60">Identity Handshake v7.2</p>
          </div>
        </div>

        <div className="w-full liquid-glass rounded-[2.5rem] p-8 border-white/5 shadow-3xl space-y-8 relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 z-50 bg-background/60 backdrop-blur-md flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
                <Cpu className="h-5 w-5 text-primary absolute inset-0 m-auto animate-pulse" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Establishing Uplink</p>
            </div>
          )}

          <Tabs defaultValue="anonymous" onValueChange={(v) => setMode(v as any)} className="w-full">
            <TabsList className="grid grid-cols-2 bg-foreground/5 h-12 rounded-xl p-1 mb-8 border border-white/5">
              <TabsTrigger value="anonymous" className="rounded-lg text-[10px] font-bold uppercase tracking-widest gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                <Zap size={14} /> Instant Sync
              </TabsTrigger>
              <TabsTrigger value="email" className="rounded-lg text-[10px] font-bold uppercase tracking-widest gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                <Mail size={14} /> Secure Uplink
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleFinalInitialize} className="space-y-6">
              <TabsContent value="anonymous" className="space-y-6 m-0 animate-in fade-in slide-in-from-left-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary ml-2 mb-2">
                    <User size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Architect Designation</span>
                  </div>
                  <Input 
                    placeholder="Enter your handle..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-14 bg-foreground/5 border-border rounded-2xl px-6 text-lg focus:ring-primary/20 text-foreground"
                    disabled={loading}
                  />
                </div>
              </TabsContent>

              <TabsContent value="email" className="space-y-4 m-0 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary ml-2 mb-2">
                    <Mail size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Neural Email</span>
                  </div>
                  <Input 
                    type="email"
                    placeholder="architect@aura.net"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 bg-foreground/5 border-border rounded-2xl px-6 focus:ring-primary/20 text-foreground"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary ml-2 mb-2">
                    <Lock size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Access Key</span>
                  </div>
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 bg-foreground/5 border-border rounded-2xl px-6 focus:ring-primary/20 text-foreground"
                    disabled={loading}
                  />
                </div>
              </TabsContent>

              <div className="space-y-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-[0.2em] gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" /> Synthesizing...</>
                  ) : (
                    <>Commence Synthesis <ArrowRight size={18} /></>
                  )}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                  <div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest"><span className="bg-[#09080A] px-4 text-muted-foreground/40">Alternative Node</span></div>
                </div>

                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-[9px] gap-3 transition-all active:scale-95"
                >
                  <Globe size={14} className="text-primary" /> Synchronize with Google
                </Button>
              </div>
            </form>
          </Tabs>
        </div>

        <div className="flex items-center gap-3 text-[8px] text-muted-foreground uppercase tracking-[0.5em] opacity-30 pb-12 md:pb-0">
          <ShieldCheck size={10} /> Secure Identity Node • AuraTune Pro
        </div>
      </div>
    </div>
  );
}
