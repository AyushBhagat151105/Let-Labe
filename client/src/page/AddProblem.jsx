import CreateProblemForm from "@/components/CreateProblemForm";
import { useAuthStore } from "@/store/useAuthStore";

import React from "react";

function AddProblem() {
    return <div>
      <CreateProblemForm />
  </div>;
}

export default AddProblem;
