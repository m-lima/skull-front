// TODO: Embed icons
interface IProps {
  icon: string;
  [propName: string]: any;
}

const Icon = (props: IProps) => <i className={props.icon} {...props} />;

export default Icon;
