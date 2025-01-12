import { Button, ButtonProps } from "../ui/button";

import Spinner from "./Spinner";

interface ServerActionButtonProps extends ButtonProps {
	pending: boolean;
}

const ServerActionButton = ({ pending, ...props }: ServerActionButtonProps) => {
	return (
		<Button
			{...props}
			disabled={pending || props.disabled}>
			{!pending ? props.children : <Spinner inline />}
		</Button>
	);
};

export default ServerActionButton;
