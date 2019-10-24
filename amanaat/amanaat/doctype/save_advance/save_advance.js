// Copyright (c) 2019, Anas and contributors
// For license information, please see license.txt

frappe.ui.form.on('Save Advance', {
	refresh: function(frm) {
		if(!frm.is_new() && parseFloat(frm.doc.balance) != 0){
			frm.add_custom_button(__('Return advance amount'),
			function() {
				frappe.prompt([
				    {'fieldname': 'amount', 'fieldtype': 'Float', 'label': 'Amount', 'reqd': 1, 'Default': frm.doc.balance}
				],
				function(values){
					if( values.amount <= parseFloat(frm.doc.balance) ){
						frappe.call({
						     doc:frm.doc,
							 method: "ReturnAdvanceAmount",
						     args:{
						         "amount": values.amount,
						     },
						     callback:function(result){
								 if(result.message == true){
									 frm.set_value("returned", parseFloat(frm.doc.returned) + values.amount);
									 frm.set_value("balance", parseFloat(frm.doc.amount) - parseFloat(frm.doc.returned));
									 frm.save();
								 }
						     }
						})
					}else{
						frappe.throw("Amount not correct")
					}
						
					
				},
				'Amount Returned',
				'Return Amount'
				)
			});
		}
	},
	amount: function(frm){
		if(frm.doc.amount){
			frm.set_value("balance", parseFloat(frm.doc.amount));
		}else{
			frm.set_value("balance", 0);
		}
	}
});
