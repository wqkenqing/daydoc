import axios from "axios";
const axios = require('axios')

const url = `/selection/search/pmt?verifyFp=verify_lr0qcx9r_p2cuDZzR_tuzX_4abK_ATmw_W9ZBnDgQgarK&fp=verify_lr0qcx9r_p2cuDZzR_tuzX_4abK_ATmw_W9ZBnDgQgarK&msToken=6WsAcHktlE9xlAdrIXhExzcndCHm0eQtk_3A2srMmLoQvyuKkuGG1aMXoEul1hcyjQj1oWPMhx310SpsHKPmz9uo-UrPxazP9awAPkRL8PYPuBeuIGxA&a_bogus=mjsQDchdMsm13SjP4hkz9b4g%2FxR0YW43gZEzghyr2toP`
const http = axios.create({
	baseURL: 'https://buyin.jinritemai.com/pc'
})

http({
	url,
	method:'post',
	data:{"page_type":0,"page":1,"page_size":60,"rec_page":1,"rec_page_size":60,"search_id":"","input_query":"","is_product_distribution":false,"is_delivery_guarantee":false,"is_ladder_cos":false,"common_filter":null}
}).then(res => {
	console.log(res);
})