import axios from "axios";

const url = `/selection/search/pmt?verifyFp=verify_lr0qcx9r_p2cuDZzR_tuzX_4abK_ATmw_W9ZBnDgQgarK&fp=verify_lr0qcx9r_p2cuDZzR_tuzX_4abK_ATmw_W9ZBnDgQgarK&msToken=6WsAcHktlE9xlAdrIXhExzcndCHm0eQtk_3A2srMmLoQvyuKkuGG1aMXoEul1hcyjQj1oWPMhx310SpsHKPmz9uo-UrPxazP9awAPkRL8PYPuBeuIGxA&a_bogus=mjsQDchdMsm13SjP4hkz9b4g%2FxR0YW43gZEzghyr2toP`
const http = axios.create({
	baseURL: 'https://buyin.jinritemai.com/pc'
})

const res = http({
	url,
	method
})