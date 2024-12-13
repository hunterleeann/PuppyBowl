import React from "react";
import { useGetPuppyQuery, useDeletePuppyMutation } from "./puppySlice";
import { useEffect, useState } from "react";

/**
 * @component
 * Shows comprehensive information about the selected puppy, if there is one.
 * Also provides a button for users to remove the selected puppy from the roster.
 */
export default function PuppyDetails({ selectedPuppyId, setSelectedPuppyId }) {
  // TODO: Grab data from the `getPuppy` query
  const { data, isSuccess, error, isLoading } =
    useGetPuppyQuery(selectedPuppyId);
  const [puppy, setPuppy] = useState({});

  // TODO: Use the `deletePuppy` mutation to remove a puppy when the button is clicked
  const [deletePuppy] = useDeletePuppyMutation();

  function removePuppy(id) {
    deletePuppy(id).then(() => {
      setSelectedPuppyId(null);
    });
  }

  console.log(puppy);
  useEffect(() => {
    if (isSuccess) {
      setPuppy(data?.data?.player);
    }
  }, [data]);

  // There are 3 possibilities:
  let $details;
  // 1. A puppy has not yet been selected.
  if (!selectedPuppyId) {
    $details = <p>Please select a puppy to see more details.</p>;
  }
  //  2. A puppy has been selected, but results have not yet returned from the API.
  else if (isLoading) {
    $details = <p>Loading puppy information...</p>;
  }
  // 3. Information about the selected puppy has returned from the API.
  else if (error) {
    $details = <p>Error loading puppy information: {error.message}</p>;
  } else {
    $details = (
      <>
        <h3>
          {puppy.name} #{puppy.id}
        </h3>
        <p>{puppy.breed}</p>
        <p>Team {puppy.team?.name ?? "Unassigned"}</p>
        <button onClick={() => removePuppy(puppy.id)}>
          Remove from roster
        </button>
        <figure>
          <img src={puppy.imageUrl} alt={puppy.name} />
        </figure>
      </>
    );
  }

  return (
    <aside>
      <h2>Selected Puppy</h2>
      {$details}
    </aside>
  );
}
