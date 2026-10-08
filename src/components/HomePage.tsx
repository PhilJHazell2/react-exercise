"use client";

import { Heading, Box } from "@cruk/cruk-react-components";
import { List } from "./list/List";
import { Form } from "./form/Form";
import { useState } from "react";
import { type NasaSearchParams } from "../types";

export const HomePage = () => {
  const [values, setValues] = useState<NasaSearchParams>();

  return (
    <Box marginTop="s" paddingTop="s">
      <Heading h1>React Exercise</Heading>
      <Form onSearch={setValues} />
      <List values={values} />
    </Box>
  );
};

export default HomePage;
