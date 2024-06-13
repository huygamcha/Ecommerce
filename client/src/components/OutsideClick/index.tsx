import { useEffect, useState } from "react";

export default function useOutsideAlerter(ref: React.RefObject<any>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
        console.log("««««« 555 »»»»»", 555);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
