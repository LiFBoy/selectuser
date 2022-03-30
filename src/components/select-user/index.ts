import OriginSelectUser from './select-user';
import {
  SelectUserFuncArgProps,
  SelectUserStaticFunctions,
} from './interface';
import show from './show';
type SelectUser = typeof OriginSelectUser & SelectUserStaticFunctions;
const SelectUser = OriginSelectUser as SelectUser;

SelectUser.show = function showFn(props: SelectUserFuncArgProps) {
  return show(props);
};

export default SelectUser;
