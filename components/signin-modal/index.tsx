"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
  addToast,
} from "@heroui/react";
import { Lock, Mail } from "lucide-react";
import SignUpModal from "../signup-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import signInDto, { SignInDtoType } from "@/dto/auth/signin";
import { mutateSignIn } from "@/framework/auth/mutate-signin";
// import { toast } from "react-toastify";

export default function SignInModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const singUpModal = useDisclosure();
  const mSignIn = mutateSignIn();

  const signInForm = useForm({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInDto),
  });

  const onSubmit = async (data: SignInDtoType) => {
    let res = await mSignIn.mutateAsync(data);

    if (res?.success) {
      signInForm.reset();
      onOpenChange();
    }
  };

  // clo

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Login{" "}
      </Button>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
        backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <ModalBody>
                <form
                  onSubmit={signInForm.handleSubmit(onSubmit)}
                  className="flex flex-col gap-2">
                  <Input
                    endContent={
                      <Mail className="text-default-400 text-2xl pointer-events-none shrink-0" />
                    }
                    label="Email"
                    placeholder="Enter your email"
                    variant="bordered"
                    {...signInForm.register("email")}
                    errorMessage={
                      signInForm.formState.errors.email?.message as string
                    }
                  />
                  <Input
                    endContent={
                      <Lock className="text-default-400 text-2xl pointer-events-none shrink-0" />
                    }
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    variant="bordered"
                    {...signInForm.register("password")}
                    errorMessage={
                      signInForm.formState.errors.password?.message as string
                    }
                  />
                  <div className="flex justify-between px-1 py-2">
                    <Checkbox
                      classNames={{
                        label: "text-small",
                      }}>
                      Remember me
                    </Checkbox>
                    <Link color="primary" href="#" size="sm">
                      Forgot password?
                    </Link>
                  </div>
                  <div>
                    Don't have an account?{" "}
                    <span
                      className="text-primary cursor-pointer"
                      onClick={singUpModal.onOpen}>
                      Sign up
                    </span>
                  </div>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" type="submit">
                      Sign in
                    </Button>
                  </ModalFooter>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <SignUpModal
        {...singUpModal}
        onSuccess={() => {
          onOpenChange();
        }}
      />
    </>
  );
}
