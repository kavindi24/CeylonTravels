import { useParams } from "react-router-dom";

function ListingDetailsPage() {
  const { id } = useParams();

  return (
    <div className="container mt-5">
      <h2>Listing ID: {id}</h2>
      <p>Display full listing details here.</p>
    </div>
  );
}
export default ListingDetailsPage;