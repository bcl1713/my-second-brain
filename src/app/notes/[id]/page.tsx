"use client";

import { useParams } from "next/navigation";

export default function Note() {
  const { id } = useParams();

  return <div>Note ID: {id}</div>;
}
