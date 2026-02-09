import {Button} from "react-native-paper";
import {View} from "react-native";

const NodeMailerEmailDemo = () => {
    return(<View style={{flex:1, backgroundColor:'#fff'}}>
        <Button

            // https://cors111-7nze1s2v2-fotomain.vercel.app/api/hello
            onPress={()=> {

                fetch(`https://netlify-email.netlify.app/.netlify/functions/send-email`, {
                        // fetch(`https://port-api-555.netlify.app/api/sendemail`, {
                        mode: "cors",
                        method: "POST",

                        headers: {

                            "Content-Type": "application/json",

                        },
                        body: JSON.stringify(
                            {
                                part1: {
                                    api_key:"",
                                    crud_type:'crud_create_sign_up_email',
                                    user_email:'vtest777999@gmail.com'
                                }
                            }
                        )
                    }
                ).then(response1 => response1.json())
                    .then(response2 => {
                        console.log('=== sendemail data ',response2)
                    })

            }}
        >
            SEND EMAIL NEXT.JS
        </Button>
    </View>)
}

export default NodeMailerEmailDemo;
