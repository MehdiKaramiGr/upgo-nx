"use client";

import signUpDto, { SignUpDtoType } from "@/dto/auth/signup-dto";
import { mutateSignUp } from "@/framework/auth/mutate-signup";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";

export default function SignUpModal({
  isOpen,
  onOpen,
  onOpenChange,
  onSuccess,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const mSignUp = mutateSignUp();
  const signUpForm = useForm({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
    },
  });

  const onSubmit = async (data: SignUpDtoType) => {
    let res = await mSignUp.mutateAsync(data);
    console.log("res", res);
    if (res?.success) {
      signUpForm.reset();
      onOpenChange(false);
      onSuccess();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
        backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Register
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={signUpForm.handleSubmit(onSubmit)}
                  id="react-hook-form"
                  className="flex flex-col gap-2">
                  <Input
                    label="Username"
                    placeholder="Enter your username"
                    variant="bordered"
                    {...signUpForm.register("username")}
                  />
                  {signUpForm.formState.errors.username && (
                    <p className="text-red-500 text-sm">
                      {signUpForm.formState.errors.username.message as string}
                    </p>
                  )}
                  <Input
                    endContent={
                      <Mail className="text-default-400 text-2xl pointer-events-none shrink-0" />
                    }
                    label="Email"
                    placeholder="Enter your email"
                    variant="bordered"
                    {...signUpForm.register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format",
                      },
                    })}
                  />
                  {signUpForm.formState.errors.email && (
                    <p className="text-red-500 text-sm">
                      {signUpForm.formState.errors.email.message as string}
                    </p>
                  )}
                  <Input
                    endContent={
                      <Lock className="text-default-400 text-2xl pointer-events-none shrink-0" />
                    }
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    variant="bordered"
                    {...signUpForm.register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  {signUpForm.formState.errors.password && (
                    <p className="text-red-500 text-sm">
                      {signUpForm.formState.errors.password.message as string}
                    </p>
                  )}
                  <Input
                    endContent={
                      <Lock className="text-default-400 text-2xl pointer-events-none shrink-0" />
                    }
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    type="password"
                    variant="bordered"
                    {...signUpForm.register("confirmPassword", {
                      required: "Confirm password is required",
                      validate: (value) =>
                        value === signUpForm.watch("password") ||
                        "Passwords do not match",
                    })}
                  />
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {
                        signUpForm.formState.errors.confirmPassword
                          .message as string
                      }
                    </p>
                  )}
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" form="react-hook-form">
                  Register
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
