"use client";
import LoginDialog from '@/components/LoginDialog';
import { useContext } from 'react'
import { AuthContext } from "@/providers/AuthProvider";
import { useRouter } from 'next/navigation';
import React from 'react'

const Page = () => {
  const { userInfo } = useContext(AuthContext);
  const router = useRouter();

  if (userInfo) {
    router.push("/");
  };
  return (
    <div>
      <LoginDialog />
    </div>
  )
}

export default Page