export const domain="http://127.0.0.1:8000"
export const expenseCategories = ["Food", "Transport", "Entertainment", "Utilities", "Healthcare", "Shopping", "Education", "Others"];
export const Appname="SplitUp"

const thisuserid = JSON.parse(sessionStorage.getItem("user_data"));
export const APIauth = ({req}) => { return ({
    method: req,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${thisuserid.access}`,
    },
})}
