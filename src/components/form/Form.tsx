import { Box, Button, TextField, Select } from "@cruk/cruk-react-components";
import { NasaSearchParams } from "../../types";
import { MEDIA_TYPE_OPTIONS } from "./Form.schema";

import { useNasaForm } from "./useNasaForm";

type SearchFormProps = {
  onSearch: (params: NasaSearchParams) => void;
};

export function Form({ onSearch }: SearchFormProps) {
  
  const { register, errors, isValid, isSubmitting, onSubmit } = useNasaForm(onSearch);

  return (
    <>
      <form noValidate onSubmit={onSubmit}>
        <Box marginBottom="m">
          <TextField
            {...register("keywords")}
            errorMessage={errors.keywords?.message}
            label="Keywords"
            required
          />
          </Box>
        <Box marginBottom="m">
          <Select
            {...register("mediaType")}
            errorMessage={errors.mediaType?.message}
            label="Media Type"
            required
          >
            <option value="">Select an option</option>
            {MEDIA_TYPE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Box>
        <Box marginBottom="m">
          <TextField
            {...register("yearSelect")}
            errorMessage={errors.yearSelect?.message}
            label="Year"
            type="number"
            required
          />
        </Box>
        <Box marginBottom="m">
          <Button type="submit" disabled={!isValid || isSubmitting}>Submit</Button>
        </Box>
      </form>
    </>
  );
}
