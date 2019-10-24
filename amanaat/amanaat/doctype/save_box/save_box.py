# -*- coding: utf-8 -*-
# Copyright (c) 2019, Anas and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from erpnext.accounts.party import get_party_account

class SaveBox(Document):
    def PaySaveAmount(self, amount):
        doc = frappe.new_doc("Save Cash")
        
        doc.save_box = self.name
        doc.cash_out = amount
        doc.details = "Pay saved amount"
        doc.type = "Pay amount"

        doc.insert()
        
        return True

    def after_insert(self):
        doc = frappe.new_doc("Save Cash")
        
        doc.save_box = self.name
        doc.cash_in = self.amount
        doc.details = self.details
        doc.type = "Save Amount"
        
        doc.insert()

    
    def GetSaveAdvanceAmount(self):
        docs = frappe.get_all("Save Advance",filters = {"save_box":self.name},fields = ["*"])
        balance = 0
        for doc in docs :
            balance += doc.balance

        if balance == 0:
            return -1
                
        return balance

    def get_party_details(self):
        if not frappe.db.exists(self.party_type, self.party):
            frappe.throw(_("Invalid {0}: {1}").format(self.party_type, self.party))
        
        _party_name = "title" if self.party_type in ("Student", "Shareholder") else self.party_type.lower() + "_name"
        party_name = frappe.db.get_value(self.party_type, self.party, _party_name)
        
        
        return {
            "party_name": party_name
        }



