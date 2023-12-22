"use client"

import { State, create } from "@/actions/create-board"
import { useFormState } from "react-dom";
import FormInput from "./form-input";
import FormButton from "./form-button";


const Form = () => {
    const intialState: State = { message: null, errors: {} };
    const [state, dispatch] = useFormState(create, intialState);
    return (
        <form action={dispatch}>
            <div className="flex flex-col space-y-2">
                <FormInput errors={state?.errors} />
            </div>
            <FormButton />
        </form>
    )
}

export default Form