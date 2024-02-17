import { myBackendGet } from "backend/api.jsw";
import { myBackendPost } from "backend/api.jsw";
import wixLocation from "wix-location";
/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
let token = "";
$w.onReady(function () {
  // Write your JavaScript here

  // To select an element by ID use: $w('#elementID')

  // Click 'Preview' to run your code
  const query = wixLocation.query;
  console.log(query["token"]);
  token = query["token"];
});

export function newPassButton_click(event) {
  const newPassword = $w("#newPass").value;
  const confirmPassword = $w("#newPassconfirm").value;
  const errorText = $w("#newPassErrorText");

  // Clear any previous error messages
  errorText.hide();

  if (newPassword && confirmPassword) {
    console.log(newPassword);
    console.log(confirmPassword);
    if (newPassword.length < 8) {
      errorText.text = "Password is too short";
      errorText.show();
    } else if (newPassword != confirmPassword) {
      errorText.text = "Password does not match";
      errorText.show();
    } else if (newPassword === confirmPassword) {
      const info = {
        token: token,
        password: newPassword,
      };
      console.log(info);

      myBackendPost(`https://api.filmatic.ai/apis/auth/resetpass`, info)
        .then((response) => {
          console.log(response);
          console.log("This is response data");
          if (response.code === 200) {
            console.log("Reset password successfully");
            wixLocation.to("/login");
          } else {
            console.log("Reset password error");
          }
        })
        .catch((error) => {
          errorText.text = "Cannot send request";
          errorText.show();
          wixLocation.to("/reset-password_verificaion");
        });
    } else {
      console.log("error");
      // One of the password fields is empty, show error message
      errorText.text = "Please enter both password fields.";
      errorText.show();
    }
  }
}
