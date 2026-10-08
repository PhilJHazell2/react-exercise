import { z } from "zod";

export const MEDIA_TYPES = ["audio", "image", "video"] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

export const MEDIA_TYPE_OPTIONS: readonly {
  value: MediaType;
  label: string;
}[] = [
  { value: "audio", label: "Audio" },
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
];

export const MIN_YEAR = 1900;
export const MAX_YEAR = 2100;

export const formSchema = z.object({
  keywords: z
    .string()
    .trim()
    .min(2, "Keywords must have at least 2 characters")
    .max(50, "Keywords must have at most 50 characters"),

  mediaType: z
    .enum(["", ...MEDIA_TYPES])
    .refine(
      (val): val is MediaType => val !== "",
      "Please select a media type",
    ),

  yearSelect: z
    .string()
    .regex(/^\d+$/, "Please enter a valid year")
    .refine(
      (val) => parseInt(val) >= MIN_YEAR,
      `Year start must be greater than ${MIN_YEAR}`,
    )
    .refine(
      (val) => parseInt(val) <= MAX_YEAR,
      `Year must be less than ${MAX_YEAR}`,
    ),
});

export type FormInput = z.input<typeof formSchema>;
export type FormValues = z.output<typeof formSchema>;

export const toSearchParams = (data: FormValues) => ({
  keywords: data.keywords,
  mediaType: data.mediaType,
  yearStart: parseInt(data.yearSelect),
});

export const initialData: FormInput = {
  keywords: "",
  mediaType: "",
  yearSelect: "",
};
