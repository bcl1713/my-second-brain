import { useRouter } from "next/router";

export default function Note() {
  const router = useRouter();
  const { id } = router.query;

  return <div>Note ID: {id}</div>;
}
