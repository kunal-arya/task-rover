import { Input } from "@/components/ui/input"
import { useFormStatus } from "react-dom"

type FormInputProps = {
    errors?: {
        title?: string[]
    }
}

const FormInput = ({ errors }: FormInputProps) => {
    const { pending } = useFormStatus();

    return (
        <div>
            <Input
                id="title"
                name="title"
                required
                placeholder="Enter a board title"
                disabled={pending}
            />
            {errors?.title &&
                <div>
                    {errors?.title.map((error) =>
                        <p key={error} className="text-rose-500">
                            {error}
                        </p>
                    )}
                </div>
            }
        </div>
    )
}

export default FormInput