import { Button, ButtonProps } from "../ui/button";

import Spinner from "./Spinner";

interface ServerActionButtonProps extends ButtonProps {
	pending: boolean;
}

const ServerActionButton = ({ pending, ...props }: ServerActionButtonProps) => {
	return (
		<Button
			{...props}
			disabled={pending || props.disabled}
			children={!pending ? props.children : <Spinner inline />}
		/>
	);
};

export default ServerActionButton;
