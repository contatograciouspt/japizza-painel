import { Input } from "@windmill/react-ui";

const InputValueFive = ({
  name,
  label,
  type,
  disabled,
  register,
  required,
  maxValue,
  minValue,
  defaultValue,
  placeholder,
}) => {
  const value = {
    valueAsNumber: true,
    required: required ? `${label} is required!` : false,
    max: {
      value: maxValue,
      message: `Valor máximo ${maxValue}!`,
    },
    min: {
      value: minValue,
      message: `Valor mínimo ${minValue}!`,
    },
    pattern: {
      value: /^[0-9]*$/,
      message: `Invalid ${label}!`,
    },
    // onBlur: (e) => handleTotalVolume(e.target.value, 'stock'),
  };

  return (
    <>
      <div className={`flex flex-row`}>
        <Input
          {...register(`${name}`, value)}
          name={name}
          type={type}
          disabled={disabled}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="mr-2 p-2"
        />
      </div>
    </>
  );
};

export default InputValueFive;
