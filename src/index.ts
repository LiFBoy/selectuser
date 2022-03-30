import OriginSelectUser from './components/select-user/select-user';
import {
  SelectUserFuncArgProps,
  SelectUserStaticFunctions,
} from './components/select-user/interface';
import show from './components/select-user/show';
type SelectUser = typeof OriginSelectUser & SelectUserStaticFunctions;
const SelectUser = OriginSelectUser as SelectUser;

SelectUser.show = function showFn(props: SelectUserFuncArgProps) {
  return show(props);
};

export default SelectUser;
