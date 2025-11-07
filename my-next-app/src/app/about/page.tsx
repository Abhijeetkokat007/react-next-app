import { Button } from "@/components/ui/button";


export default function AboutPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold">About Us</h1>
      <p className="text-gray-600 mt-2">This is the About page.</p>
       <Button variant="outline">Outline Button</Button>
        <Button variant="destructive">Delete</Button>
    </div>
  );
}
