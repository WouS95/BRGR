<template>
    <div class="bg">
        <button @click="handleClick"><span class="material-icons"> cancel</span>Cancel</button>
        <br>
        <div class="statusButton orange" @click="changeStateTo('preparing')">
            Preparing
        </div>
        <br>
        <div class="statusButton green" @click="changeStateTo('ready')">
            Ready
        </div>
        <div class="statusButton green" @click="changeStateTo('done')">
            Done
        </div>
        <br>
        <div class="statusButton rood" @click="changeStateTo('canceled')">
            Canceled
        </div>

    </div>
</template>

<script>
import {projectFirestore} from '../../firebase/config'

export default {
    props: ['orderId'],
    setup(props, context){
        const handleClick = () => {
            context.emit('closePopup');
        }

        const changeStateTo = async (state) => {
            await projectFirestore.collection('orders').doc(props.orderId).update({orderStatus: state})
            handleClick()
        }

        return{handleClick, changeStateTo}
    }
}
</script>

<style scoped>
    .bg {
        z-index: 1;
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        padding: 75px 50px;
        text-align: left;
    }

    button {
        font-size: 100%;
    }
    
    .statusButton {
        padding: 30px 0px;
        width: 250px;
        color: #FFF;
        font-weight: 600;
        border-radius: 10px;
        text-align: center;
        margin-top: 30px;
        margin-right: 30px;
        display: inline-block;
        font-size: 1.2em;
    }

    .statusButton:hover {
        cursor: pointer;
    }

    .orange {
        background: #F57C00;
    }

    .green {
        background: #7CB342;
    }

    .rood {
        background: #D32F2F;
    }

</style>