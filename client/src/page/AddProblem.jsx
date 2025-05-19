import CreateProblemForm from "@/components/CreateProblemForm";
import Test from "@/components/Test";
import { useAuthStore } from "@/store/useAuthStore";

import React from "react";

function AddProblem() {
  return (
    <div>
      <CreateProblemForm />
      {/* <Test /> */}
    </div>
  );
}

export default AddProblem;
