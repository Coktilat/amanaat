# -*- coding: utf-8 -*-
# Copyright (c) 2019, Anas and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class SaveAdvance(Document):
    def ReturnAdvanceAmount(self, amount):
        doc = frappe.new_doc("Save Cash")
        
        doc.save_advance = self.name
        doc.save_box = self.save_box
        doc.cash_in = amount
        doc.details = "Return advance amount"
        doc.type = "Return Advance"
        
        doc.insert()
        
        return True

    def after_insert(self):
        doc = frappe.new_doc("Save Cash")
        
        doc.save_advance = self.name
        doc.save_box = self.save_box
        doc.cash_out = self.amount
        doc.details = self.details
        doc.type = "Save Advance"
        
        doc.insert()
