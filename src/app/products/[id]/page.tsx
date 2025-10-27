export default function ProductPage({ params }: { params: { id: string } }) {
  return <h1>Product ID: {params.id} </h1>;
}
