import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type NasaSearchParams } from "../../types";

import {
  formSchema,
  type FormInput,
  type FormValues,
  initialData,
  toSearchParams,
} from "./Form.schema";

export function useNasaForm(onSearch: (params: NasaSearchParams) => void) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "firstError",
    shouldFocusError: true,
    defaultValues: initialData,
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (event?: React.BaseSyntheticEvent) => {
    void handleSubmit((values) => onSearch(toSearchParams(values)))(event);
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isValid,
    isSubmitting,
  };
}
