"use client";

import { useLoaderStore } from "@/lib/loaderStore";
import Loader from "./Loader";

export default function LoaderWrapper() {
  const loading = useLoaderStore((state) => state.loading);
  return loading ? <Loader /> : null;
}
