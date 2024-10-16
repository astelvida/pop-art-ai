"use client";

import { type ElementRef, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<"dialog">>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss() {
    router.back();
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className="absolute h-screen w-screen bg-black/90"
      onClose={onDismiss}
      data-testid="modal"
    >
      {children}
      <Button onClick={onDismiss} className="close-button">
        Close
      </Button>
    </dialog>,
    document.getElementById("modal-root")!,
  );
}
