import { Button } from "@/components/ui/button";


export default function Page() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold">Product Page</h1>
      <p className="text-gray-600 mt-2">This is the Product page.</p>
       <Button variant="outline">Outline Button</Button>
        <Button variant="destructive">Delete</Button>
    </div>
  );
}
