// Copyright (c) 2019, Anas and contributors
// For license information, please see license.txt

frappe.ui.form.on('Save Box', {
	refresh: function(frm) {
		if(!frm.is_new() && parseFloat(frm.doc.balance) != 0){
			frm.add_custom_button(__('Pay save amount'),
			function() {
				frappe.prompt([
				    {'fieldname': 'amount', 'fieldtype': 'Float', 'label': 'Amount', 'reqd': 1, 'Default': frm.doc.balance}  
				],
				function(values){
					frappe.call({
					     doc:frm.doc,
						 method: "GetSaveAdvanceAmount",
					     callback:function(balance){
							 var balance_value = 0;
							 if(balance.message > 0){
								 balance_value = balance.message;
							 }
							 console.log(balance.message);
							 console.log(balance_value);
							 if(values.amount <= (parseFloat(frm.doc.balance) - balance_value)){
			 						frappe.call({
			 						     doc:frm.doc,
			 							 method: "PaySaveAmount",
			 						     args:{
			 						         "amount": values.amount,
			 						     },
			 						     callback:function(result){
			 								 if(result.message == true){
			 									 frm.set_value("payed", parseFloat(frm.doc.payed) + values.amount);
			 									 frm.set_value("balance", parseFloat(frm.doc.amount) - parseFloat(frm.doc.payed));
			 									 frm.save();
			 								 }
			 						     }
			 						})
								}else{
									frappe.throw("Balance not enough")
								}
							}
					  })
						
					
				},
				'Amount Payment',
				'Pay Amount'
				)
			});
		}
	},
	setup: function(frm){
		frm.set_query("party_type", function() {
			return{
				"filters": {
					"name": ["in", Object.keys(frappe.boot.party_account_types)],
				}
			}
		});
		
	},
	amount: function(frm){
		if(frm.doc.amount){
			frm.set_value("balance", parseFloat(frm.doc.amount));
		}else{
			frm.set_value("balance", 0);
		}
	},
	party: function(frm) {
		
		if(frm.doc.party_type && frm.doc.party) {
			if(!frm.doc.date) {
				frappe.msgprint(__("Please select Save Date before selecting Party"))
				frm.set_value("party", "");
				return ;
			}

			return frappe.call({
			 	doc:frm.doc,
				method: "get_party_details",
				callback: function(r, rt) {
					if(r.message) {
						frappe.run_serially([
							() => frm.set_value("party_name", r.message.party_name),
						]);
					}
				}
			});
		}
	},
	
});
