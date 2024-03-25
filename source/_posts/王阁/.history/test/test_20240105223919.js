// import axios from "axios";
const axios = require('axios')

const url = `/selection/search/pmt?verifyFp=verify_lr0qcx9r_p2cuDZzR_tuzX_4abK_ATmw_W9ZBnDgQgarK&fp=verify_lr0qcx9r_p2cuDZzR_tuzX_4abK_ATmw_W9ZBnDgQgarK&msToken=6WsAcHktlE9xlAdrIXhExzcndCHm0eQtk_3A2srMmLoQvyuKkuGG1aMXoEul1hcyjQj1oWPMhx310SpsHKPmz9uo-UrPxazP9awAPkRL8PYPuBeuIGxA&a_bogus=mjsQDchdMsm13SjP4hkz9b4g%2FxR0YW43gZEzghyr2toP`
const http = axios.create({
	baseURL: 'https://buyin.jinritemai.com/pc',
	headers:{
		:authority:
buyin.jinritemai.com
:method:
POST
:path:
/pc/selection/search/pmt?verifyFp=verify_lr0qcx9r_p2cuDZzR_tuzX_4abK_ATmw_W9ZBnDgQgarK&fp=verify_lr0qcx9r_p2cuDZzR_tuzX_4abK_ATmw_W9ZBnDgQgarK&msToken=6WsAcHktlE9xlAdrIXhExzcndCHm0eQtk_3A2srMmLoQvyuKkuGG1aMXoEul1hcyjQj1oWPMhx310SpsHKPmz9uo-UrPxazP9awAPkRL8PYPuBeuIGxA&a_bogus=mjsQDchdMsm13SjP4hkz9b4g%2FxR0YW43gZEzghyr2toP
:scheme:
https
Accept:
application/json, text/plain, */*
Accept-Encoding:
gzip, deflate, br
Accept-Language:
zh-CN,zh;q=0.9,en;q=0.8
Content-Length:
208
Content-Type:
application/json
Cookie:
x-jupiter-uuid=17044648410924330; gf_part_1176317=50; _tea_utm_cache_3813=undefined; s_v_web_id=verify_lr0qcx9r_p2cuDZzR_tuzX_4abK_ATmw_W9ZBnDgQgarK; scmVer=1.0.1.5997; passport_csrf_token=b867d21223bc08bdeb318929fb761b98; passport_csrf_token_default=b867d21223bc08bdeb318929fb761b98; ttcid=bcef1fd2c47f43268c1cef9ba502c96018; tt_scid=TFnk-f665Zv1xNDFbkWYu-YNQ26v94sgzdpceXK-FN83hMnGSMHcEEUi8tb6cO48ca72; ttwid=1%7CuGEkUEgbzyRFqZCJW5Wuj4XmCKspkQhZ6fDTupMDAG0%7C1704464879%7Cf199b286809953b094abbf1d9840c16f71eb8ac5e689de82d92707f69fbe6555; n_mh=pW7vJKKUKQODX2j0VuPn11q4MVl5hx2ROic9AbTNf8o; passport_auth_status=20e59440fb0e27ff76b9c91d0e181c91%2C; passport_auth_status_ss=20e59440fb0e27ff76b9c91d0e181c91%2C; sso_uid_tt=5a93ec9b390f1d948297f9194db66a43; sso_uid_tt_ss=5a93ec9b390f1d948297f9194db66a43; toutiao_sso_user=361f401c6c1c856df8f0445a6618ecdb; toutiao_sso_user_ss=361f401c6c1c856df8f0445a6618ecdb; sid_ucp_sso_v1=1.0.0-KDU3NmQ2NzUzMWYyNTNiZTUxNjU5OWRiZWEyOTNjODQ4OTM1MjcyYzMKHgism5Chz8ziBhDxo-CsBhiPESAMMLmEvaoGOAhAJhoCbGYiIDM2MWY0MDFjNmMxYzg1NmRmOGYwNDQ1YTY2MThlY2Ri; ssid_ucp_sso_v1=1.0.0-KDU3NmQ2NzUzMWYyNTNiZTUxNjU5OWRiZWEyOTNjODQ4OTM1MjcyYzMKHgism5Chz8ziBhDxo-CsBhiPESAMMLmEvaoGOAhAJhoCbGYiIDM2MWY0MDFjNmMxYzg1NmRmOGYwNDQ1YTY2MThlY2Ri; uid_tt=65cf1aa8d9e767222bc0aa2200eae3e9; uid_tt_ss=65cf1aa8d9e767222bc0aa2200eae3e9; sid_tt=a84ff115581da571bb0bf577eeffe792; sessionid=a84ff115581da571bb0bf577eeffe792; sessionid_ss=a84ff115581da571bb0bf577eeffe792; store-region=cn-sc; store-region-src=uid; odin_tt=96eafe689f7fbdc1615fe46ec0b45e32d5c5de85a25bc8dc2e4fa8b85f9e4166fa73f7ad3cbe3d0fa0c41148952496cc2feb3b820fa143f447b0af227b8d3307; ucas_c0_buyin=CkEKBTEuMC4wEKeIkoKvvITMZRi9LyDw4fCgz8z-BCiPETCsm5Chz8ziBkDzo-CsBkjz15yvBlCTvKCIjfK4q2VYfhIUfNZhkiJxcObZt7Okcy-76T3kvV0; ucas_c0_ss_buyin=CkEKBTEuMC4wEKeIkoKvvITMZRi9LyDw4fCgz8z-BCiPETCsm5Chz8ziBkDzo-CsBkjz15yvBlCTvKCIjfK4q2VYfhIUfNZhkiJxcObZt7Okcy-76T3kvV0; sid_guard=a84ff115581da571bb0bf577eeffe792%7C1704464883%7C5184000%7CTue%2C+05-Mar-2024+14%3A28%3A03+GMT; sid_ucp_v1=1.0.0-KDFkNmE1Y2IxZTA2OTZiM2NlOGJjMjZhMjRjOTRkMWU0ZWFmNmU0NmQKGAism5Chz8ziBhDzo-CsBhiPESAMOAhAJhoCaGwiIGE4NGZmMTE1NTgxZGE1NzFiYjBiZjU3N2VlZmZlNzky; ssid_ucp_v1=1.0.0-KDFkNmE1Y2IxZTA2OTZiM2NlOGJjMjZhMjRjOTRkMWU0ZWFmNmU0NmQKGAism5Chz8ziBhDzo-CsBhiPESAMOAhAJhoCaGwiIGE4NGZmMTE1NTgxZGE1NzFiYjBiZjU3N2VlZmZlNzky; SASID=SID2_7320620020539687178; BUYIN_SASID=SID2_7320620020539687178; buyin_shop_type=24; buyin_account_child_type=1128; buyin_app_id=1128; buyin_shop_type_v2=24; buyin_account_child_type_v2=1128; buyin_app_id_v2=1128; csrf_session_id=408f2150fdea0ddc44395f1c541d6424; msToken=8PhVqFm_61-h9R2ojgHUZLsqcQ_nyJdyVAj4Yck7k_SilNcQk4EE4xDy2EAuTT_ZA54rGBIc5DzjwkPA5RWBtiXCCoeY432jtB5uQqLeZl28454cwST3
Dnt:
1
Origin:
https://buyin.jinritemai.com
Referer:
https://buyin.jinritemai.com/dashboard/merch-picking-hall/center?default_tab=3&btm_ppre=a10091.b0.c809509.d0&btm_pre=a10091.b30986.c72928.d0&btm_show_id=bdda521a-a05e-4c8d-8f99-9e8e851f8761&cart_source_key=3
Sec-Ch-Ua:
"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"
Sec-Ch-Ua-Mobile:
?0
Sec-Ch-Ua-Platform:
"Windows"
Sec-Fetch-Dest:
empty
Sec-Fetch-Mode:
cors
Sec-Fetch-Site:
same-origin
User-Agent:
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
	}
})

http({
	url,
	method:'post',
	data:{"page_type":0,"page":1,"page_size":60,"rec_page":1,"rec_page_size":60,"search_id":"","input_query":"","is_product_distribution":false,"is_delivery_guarantee":false,"is_ladder_cos":false,"common_filter":null}
}).then(res => {
	console.log(res);
})