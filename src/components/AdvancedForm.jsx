import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    hobbies: z.array(z.object({ name: z.string().min(1, "Hobby can't be empty") })),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const AdvancedForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { hobbies: [{ name: "" }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "hobbies" });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">React Hook Form</h2>

      {submitted && <p className="success-message">🎉 Form submitted successfully!</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="input-group">
          <label>Name</label>
          <input {...register("name")} className="input-field" />
          {errors.name && <p className="error-text">{errors.name.message}</p>}
        </div>

        <div className="input-group">
          <label>Email</label>
          <input {...register("email")} className="input-field" />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div className="input-group">
          <label>Password</label>
          <input type="password" {...register("password")} className="input-field" />
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>

        <div className="input-group">
          <label>Confirm Password</label>
          <input type="password" {...register("confirmPassword")} className="input-field" />
          {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
        </div>

        <div className="hobby-section">
          <label>Hobbies</label>
          {fields.map((field, index) => (
            <div key={field.id} className="hobby-item">
              <input {...register(`hobbies.${index}.name`)} className="input-field small" />
              <button type="button" onClick={() => remove(index)} className="remove-btn">✖</button>
            </div>
          ))}
          <button type="button" onClick={() => append({ name: "" })} className="add-hobby-btn">
            + Add Hobby
          </button>
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default AdvancedForm;
