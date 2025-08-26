import Input from "./Input.astro";
import InputFeedback from "./InputFeedback.astro";
import InputLabel from "./InputLabel.astro";
import InputWrapper from "./InputWrapper.astro";

export { InputWrapper, InputLabel, Input, InputFeedback };

export default {
  Root: InputWrapper,
  Label: InputLabel,
  Input: Input,
  Feedback: InputFeedback,
};
